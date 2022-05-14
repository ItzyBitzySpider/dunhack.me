from setuptools import setup

setup(
        name='dunhack',
        version='0.0.0',
        py_modules=['dunhack'],
        install_requires=[
            'boto3',
            'click', 
            'psycopg'
        ],
        entry_points={
            'console_scripts': [
                'dunhack = dunhack:cli',
            ],
        },
    )
