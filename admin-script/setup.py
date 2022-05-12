from setuptools import setup

setup(
        name='dunhack',
        version='0.0.0',
        py_modules=['dunhack'],
        install_requires=[
            'click', 
            'psycopg[binary]'
        ],
        entry_points={
            'console_scripts': [
                'dunhack = dunhack:cli',
            ],
        },
    )
